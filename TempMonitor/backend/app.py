from flask import Flask, jsonify
import requests
import openai
from config import OPENWEATHERMAP_API_KEY, OPENAI_API_KEY

app = Flask(__name__)

CITY = "Phoenix"
UNITS = "imperial"  # Fahrenheit
OPENWEATHERMAP_URL = "https://api.openweathermap.org/data/2.5/weather"

openai.api_key = OPENAI_API_KEY

def get_phoenix_temperature():
    params = {
        "q": CITY,
        "appid": OPENWEATHERMAP_API_KEY,
        "units": UNITS
    }
    response = requests.get(OPENWEATHERMAP_URL, params=params)
    response.raise_for_status()
    data = response.json()
    return data["main"]["temp"]

def generate_notification_message(temp):
    prompt = (
        f"The temperature in Phoenix is {temp}°F. "
        "Write a friendly and urgent browser notification encouraging the user to stay cool."
    )
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return completion.choices[0].message["content"].strip()

@app.route("/check-temperature", methods=["GET"])
def check_temperature():
    try:
        temp = get_phoenix_temperature()
        if temp > 100:
            message = generate_notification_message(temp)
            return jsonify({"notify": True, "message": message})
        else:
            return jsonify({"notify": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
