import os
import json
from datetime import datetime
from pathlib import Path
import re
from dotenv import load_dotenv
import asyncio

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import (
    openai,
    silero
)
#from livekit.plugins.turn_detector.multilingual import MultilingualModel

# Load environment variables from .env file
load_dotenv()

common_instructions = """You are a helpful assitant , handles users query"""

# Define the voice AI agent
class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=common_instructions)

# Entrypoint function for the agent session
async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()

    # Initialize session with supported plugins
    session = AgentSession(
        stt=openai.STT(model="gpt-4o-transcribe"),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=openai.TTS(model="tts-1", voice="nova"),
        vad=silero.VAD.load(),
        #turn_detection=MultilingualModel(),
    )

    # ---- New changes from here ---- #

    # Participant disconnect event handling
    def handle_disconnect(participant):
        print(f"[INFO] Participant {participant.identity} disconnected.")
        asyncio.create_task(shutdown_session())

    async def shutdown_session():
        await ctx.shutdown()

    ctx.room.on("participant_disconnected", handle_disconnect)

    # Start the session in the specified room
    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(),  # No noise cancellation
    )

    # Greet the user using voice
    await session.generate_reply(
        instructions="Greet the user and offer your assistance."
    )

# Run the agent as a LiveKit worker
if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))