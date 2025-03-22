import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import os from "os";

/**
 * API endpoint for audio transcription
 * This implementation uses a server-side approach for demonstration purposes.
 * In production, you would use a proper speech-to-text service.
 */
export async function POST(request: NextRequest) {
  try {
    // For demo, we'll store the uploaded audio temporarily and return the actual text from the request
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    const manualTranscription = formData.get("manualText") as string | null;

    if (manualTranscription) {
      // If a manual transcription was provided (for debugging/testing), use it
      return NextResponse.json({
        text: manualTranscription,
        confidence: 0.99,
      });
    }

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file found in request" },
        { status: 400 }
      );
    }

    // Log information about the received audio file
    console.log(
      `Received audio file: ${audioFile.name}, type: ${audioFile.type}, size: ${audioFile.size} bytes`
    );

    try {
      // In a real implementation, you would send this to a speech-to-text service like
      // Google Cloud Speech-to-Text, Azure Speech Services, or AWS Transcribe

      // For demo purposes only - we're returning a message indicating the audio was received
      // but we can't actually process it server-side without a proper speech-to-text service

      return NextResponse.json({
        text: "Audio received successfully. Please use the text input while we work on implementing a production-ready transcription service.",
        confidence: 0.99,
        received: true,
        originalAudioSize: audioFile.size,
      });
    } catch (error) {
      console.error("Error handling audio:", error);
      return NextResponse.json(
        { error: "Failed to process audio" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
