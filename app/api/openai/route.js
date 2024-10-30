import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Handler for POST requests to get a response from OpenAI's chat model
export async function POST(request) {
  try {
    // Extract the prompt from the request body
    const { prompt } = await request.json();

    // Generate a response using the OpenAI API with the specified model and prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const response = completion.choices[0].message.content;

    // Return the generated response in JSON format
    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle internal server errors and return a generic error message
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
