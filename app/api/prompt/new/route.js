import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { auth } from "@/auth";

export const POST = async (req) => {
  const { userId, prompt, tag } = await req.json();
  const session = await auth();

  if (!session || session.user.id !== userId) {
    return new Response("User is not authenticated", { status: 401 });
  }

  try {
    await connectToDB();
    const newPrompt = new Prompt({
      creator: userId,
      prompt,
      tag,
    });

    await newPrompt.save();

    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
