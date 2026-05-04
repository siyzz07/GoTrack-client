# Vehicle Travel Details Calculation - Client (Frontend)

## What is this project?
This is the React frontend application for the Vehicle Travel Details Calculation project. It provides the user interface for tracking, calculating, and visualizing vehicle telemetry data.

## What is the purpose of the project?
The primary purpose of this frontend is to allow users to interactively analyze vehicle trips. By plotting raw GPS coordinates from the server onto an interactive map, it calculates the vehicle's speed, distance traveled, idle times, and stoppage times, giving users deep insights into driving patterns.

## Main Features
* **Authentication UI**: Secure user login and registration interface interacting with the backend JWT authentication system.
* **Interactive Map Visualization**: Uses Leaflet to plot exact vehicle routes. The drawn path is color-coded to instantly show when the vehicle was:
  * Moving (Normal driving)
  * Stopped (Ignition off)
  * Idling (Ignition on, but not moving)
  * Over Speeding (Speed exceeds 60 km/h)
* **Custom Segment Analysis**: Users can select any two specific points during their trip to calculate the exact distance, elapsed time, and average speed specifically for that small segment of the journey.
* **Telemetry Data Log**: A detailed, interactive table showing the timestamp, calculated speed, gap distance, and ignition status for every single GPS ping.
