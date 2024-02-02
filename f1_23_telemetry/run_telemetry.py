import socket
import struct
import time

def main():
    # Create a UDP socket for receiving telemetry data
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udp_socket.bind(('localhost', 20777))

    try:
        # Example loop to continuously receive telemetry packets
        while True:
            # Receive a telemetry packet (assumed to be 136 bytes in this example)
            packet, addr = udp_socket.recvfrom(136)
            
            # Parse the telemetry packet based on your data structure
            # Assuming the packet contains float values for speed and RPM
            if len(packet) == 136:
                speed, rpm = struct.unpack('ff', packet[4:12])

                # Process the telemetry data as needed
                print(f"Speed: {speed} m/s, RPM: {rpm} RPM")

            # Sleep to prevent overwhelming the CPU
            time.sleep(0.1)

    except KeyboardInterrupt:
        print("Telemetry listener stopped by user.")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        udp_socket.close()

if __name__ == "__main__":
    main()
