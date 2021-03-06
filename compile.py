import re

def compile(name):
	print "Compiling "+name+"..."

	file = open('src/' + name + '/' + name + '.tpl.html', 'r')
	tpl=file.read()
	tpl=tpl.replace("'","\\'");
	tpl=tpl.replace("\n","").replace("\r","").replace("\t"," ")
	tpl=re.sub("\s\s+" , " ", tpl)

	file = open('src/' + name + '/' + name + '.js', 'r')
	js=file.read()
	js=js.replace("%%TEMPLATE%%",tpl)
	
	text_file = open("dist/" + name + ".min.js", "w")
	text_file.write(js)
	text_file.close()
	
	try:
		file = open('src/' + name + '/' + name + '.css', 'r')
		js=file.read()
		text_file = open("dist/" + name + ".css", "w")
		text_file.write(js)
		text_file.close()
	except:
		pass
		
compile("ilTable")
compile("ilDetail")
compile("ilModal")
compile("ilAdvancedCombo")
compile("ilInput")
compile("ilTable2")
compile("ilWeek")
compile("ilYearCalendar")
compile("ilUpload")
compile("ilSurvey")
compile("ilList")
compile("ilPanel")
compile("ilLoadingButton")
compile("ilSearch")
compile("ilCVSTable")
compile("ilCalendar")
compile("ilMasterDetail")