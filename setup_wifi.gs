user = "jarvis"
pass = "C2CoaDyj3cPsG2"

crypto = include_lib("/lib/crypto.so")
airmonResult = airmon(crypto, "start", "wlan0")

if typeof(airmonResult) == "string" then
   print("There was an error while switching monitoring mode: " + airmonResult)
else
   print("Monitoring mode switched on successfully.")
end if

hostComputer = get_shell(user, pass).host_computer

networks = hostComputer.wifi_networks("wlan0")
result = []

for network in networks
	parsedItem = network.split(" ")
	item = {}
	item.BSSID = parsedItem[0]
   item.PWR = parsedItem[1].remove("%").to_int
   item.ESSID = parsedItem[2]
   result.push(item)
end for

result.sort("PWR", 0)
bssid = result[0].BSSID
essid = result[0].ESSID
pwr = result[0].PWR
potentialAcks = 300000 / pwr
crypto.aireplay(bssid, essid, potentialAcks)
wifiPassword = crypto.aircrack("/home/" + active_user + "/file.cap")
print(wifiPassword)

connectionResult = hostComputer.connect_wifi ("wlan0", bssid, essid, wifiPassword)
if typeof(connectionResult) == "string" then
   print("There was an error while connecting to new Wifi: " + connectionResult)
else
   print("Connected to "+essid+" successfully.")
end if

airmonResult = airmon(crypto, "stop", "wlan0")

if typeof(airmonResult) == "string" then
   print("There was an error while switching monitoring mode: " + airmonResult)
else
   print("Monitoring mode switched off successfully.")
end if
