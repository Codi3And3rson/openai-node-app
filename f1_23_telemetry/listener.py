import asyncio
import logging

logging.basicConfig(level=logging.INFO)

async def handle_connection(reader, writer):
    try:
        data = await reader.read(100)  # Adjust based on expected message size
        message = data.decode('utf-8')
        
        # Process the incoming message
        logging.info(f"Received message: {message}")
        # Add message processing logic here
        
        # Send a response
        writer.write("Message received".encode('utf-8'))
        await writer.drain()
    except Exception as e:
        logging.error(f"Error handling connection: {e}")
    finally:
        writer.close()
        await writer.wait_closed()

async def start_server(port):
    server = await asyncio.start_server(handle_connection, 'localhost', port)
    logging.info(f"Serving on {port}")
    
    async with server:
        await server.serve_forever()

if __name__ == "__main__":
    port = 8888  # Example port
    asyncio.run(start_server(port))
