import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { auth } from "@/auth";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");

    if (!prompt) return new Response("Prompt not found", { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompt", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  const { prompt, tag } = await req.json();

  try {
    const session = await auth();
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id).populate("creator");

    if (!session || session.user.id !== existingPrompt.creator._id.toString()) {
      return new Response("User is not authenticated", { status: 401 });
    }

    if (!prompt) return new Response("Prompt not found", { status: 404 });

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response("Failed to update prompt", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const session = await auth();
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id).populate("creator");

    if (!session || session.user.id !== existingPrompt.creator._id.toString()) {
      return new Response("User is not authenticated", { status: 401 });
    }

    await Prompt.findByIdAndDelete(params.id);

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete prompt", { status: 500 });
  }
};
