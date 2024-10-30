import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Handler for POST requests to stream responses from OpenAI's chat model
export async function POST(request) {
  try {
    // Extract the prompt from the request body
    const { prompt } = await request.json();

    // Generate a streaming response from the OpenAI API with the specified model and prompt
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    // Create a readable stream to send chunks of data as they arrive
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(content); // Enqueue each chunk of content
          }
        }
        controller.close(); // Close the stream when all data is sent
      },
    });

    // Return the stream response with appropriate headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    // Handle internal server errors and return a generic error message
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
