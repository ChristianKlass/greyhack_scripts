apt=null
root=get_shell.host_computer.File("/")

newFiles=[]
newFiles=newFiles+root.get_folders+root.get_files

while newFiles.len
    currFile=newFiles.pull
    if currFile.is_folder then 
		newFiles = currFile.get_folders+currFile.get_files+newFiles
    end if
    test=include_lib(currFile.path)
    if typeof(test) == "aptclientLib" and not apt then
        apt = test
    end if 
end while

if not apt then exit("No Apt library.")

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

	print ("Checking "+ip+rports+"...")

    for port in rports
        if port[2] == "repository" then
			memory = hackshops+1
			print("Hackshops Found: "+memory+"/"+hackshopsNeeded)
			apt.add_repo(ip, port[0])
			hackshops = hackshops+1
			continue
		end if
    end for
end while

apt.update
print (hackshops + " hackshop(s) generated.")

install_list=[]
install_list.push("viper")
install_list.push("crypto.so")
install_list.push("metaxploit.so")
install_list.push("vbt")

for item in install_list
    apt.install(item)
end for

binFiles=get_shell.host_computer.File("/bin").get_files
libFiles=get_shell.host_computer.File("/lib").get_files

for file in binFiles
	print (file.path)
end for

for file in libFiles
	print (file.path)
end for