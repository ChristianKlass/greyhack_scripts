apt=include_lib("/lib/aptclient.so")
root=get_shell.host_computer.File("/")

if params.len >= 1 then
    hackshopsNeeded=params[0].to_int
else
    hackshopsNeeded=5
end if 

getRandomIp=function()
    octets=[]
    for i in range (0,3)
        octets.push(floor(rnd*256))
    end for

    return octets.join(".")
end function

hackshops=0
while hackshops < hackshopsNeeded
    while 1
        ip = getRandomIp
        if not get_router(ip) or is_lan_ip(ip) then continue
        break
    end while

    router=get_router(ip)
    ports=router.used_ports
    rports=[]
    for port in ports
		//print (port.port_number)
        serv=[]
		serv.push(router.public_ip)
		serv.push(port.port_number)
		portInfo=router.port_info(port).split(" ")
        serv.push(portInfo[0])
        rports.push(serv)
    end for

//	print ("Checking "+ip+rports+"...")

    for port in rports
        if port[2] == "repository" then
			memory = hackshops+1
			print("Hackshops Found: "+memory+"/"+hackshopsNeeded+" ("+ip+":"+port[1]+")")
			apt.add_repo(ip, port[1])
			hackshops = hackshops+1
			continue
		end if
    end for
end while

viper_ip = nslookup("www.viper.com")
apt.add_repo(viper_ip)
apt.update
print (hackshops + " hackshop(s) found.")

sources = "/etc/apt/sources.txt"
sources = get_shell.host_computer.File(sources)
if sources != null then
	print(sources.get_content)
else 
	print("Can't print sources.txt at: " + sources)
end if

install_list=[]
install_list.push("viper")
install_list.push("crypto.so")
install_list.push("metaxploit.so")
install_list.push("vbt")
install_list.push("decipher")
install_list.push("AdminMonitor.exe")

for item in install_list
    apt.install(item)
end for