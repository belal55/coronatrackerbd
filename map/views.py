from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
import requests 
import json
from .models import Country,District
import ast

# Create your views here.

def home(request):
	return render(request,'map/home.html')

def getData(request):
	URL = 'http://covid19tracker.gov.bd/api/map'
	URL2 = 'http://covid19tracker.gov.bd/api/district'

	response=None
	response2=None
	response3=None
	countryList=[]
	districtList=[]

	try:
		response = requests.get(URL).json()
		response2 = requests.get(URL2).json()
		districtList=response2
		for row in response['features']:
			if row['properties'].get('RationPerMillion'):
				row['properties']['iso3']=row['id']
				countryList.append(row['properties'])
	except:
		countryList=[]
		districtList=[]
		countryList=list(Country.objects.all().values())
		disJson=ast.literal_eval(District.objects.all()[:1].get().jsonData)
		districtList.append(disJson)

	context={'countryList':countryList,'districtList':districtList}
	return JsonResponse(context)

def tabularData(request):
	return render(request,'map/tabularData.html')


def fetchData(request):
	URL = 'http://covid19tracker.gov.bd/api/map'
	URL2 = 'http://covid19tracker.gov.bd/api/district'
	URL3 = 'https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/timeseries'
	response=None
	response2=None
	response3=None
	countryList=[]
	districtList=[]
	context={'success':False}
	try:

		response = requests.get(URL).json()
		response2 = requests.get(URL2).json()
		districtList=response2
		for row in response['features']:
			if row['properties'].get('RationPerMillion'):
				row['properties']['iso3']=row['id']
				countryList.append(row['properties'])

		Country.objects.all().delete()
		Country.objects.bulk_create([ Country(iso3=c['iso3'],latitude=c['latitude'],longitude=c['longitude'],RationPerMillion=c['RationPerMillion'],TotalDeaths=c['TotalDeaths'],
				NewCases=c['NewCases'],TotalCases=c['TotalCases'],bnName=c['bnName'],name=c['name'],TotalRecovered=c['TotalRecovered'],NewDeaths=c['NewDeaths'],
				ActiveCases=c['ActiveCases'],SeriousCases=c['SeriousCases']) for c in countryList])
		
		District.objects.all().delete()
		District.objects.create(jsonData=districtList)
		context['success']=True
	except:
		context['success']=False
	
	print(context['success'])
	return JsonResponse(context)