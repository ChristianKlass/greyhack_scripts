filePath = "/home/" + active_user + "/tmp/tobreak"
dictPath = "/home/" + active_user + "/dictionary.txt"
crypto = include_lib("/lib/crypto.so")

file = get_shell.host_computer.File(filePath)
if file != null then
	file_contents = file.get_content
else
	print ("File at " + filePath + " does not exist.")
	exit
end if

dict = get_shell.host_computer.File(dictPath)
if dict != null then
	dict_contents = dict.get_content
else
	touch dictPath
	dict = get_shell.host_computer.File(dictPath)
end if


lines = file_contents.split("\n")
results = []

for line in lines
	parsedItems = line.split(":")
	item = {}
	item.user = parsedItems[0]
	item.pass = decipher(crypto, parsedItems[1])

    //write to dictionary file
	dict_contents = dict.get_content + item.pass + char(10)
	dict.set_content(dict_contents)
	results.push(item)
end for

for result in results
	print (result)
end for