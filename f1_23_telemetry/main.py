import asyncio
import logging
from listener import start_listener
from appendices import load_appendices
from config import load_config
from database import initialize_database

logging.basicConfig(level=logging.INFO)

async def main():
    try:
        logging.info("Application startup initiated.")
        
        # Load configuration
        config = await load_config()
        
        # Initialize database connections asynchronously
        await initialize_database(config.database_url)
        
        # Load additional components
        await load_appendices()
        
        # Start the listener in the background
        asyncio.create_task(start_listener(config.listener_port))
        
        logging.info("Application startup completed.")
    except Exception as e:
        logging.error(f"Failed to start the application: {e}")
        exit(1)

if __name__ == "__main__":
    asyncio.run(main())
