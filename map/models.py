from django.db import models

# Create your models here.
class Country(models.Model):
	iso3=models.CharField(max_length=5,default="")
	latitude=models.FloatField(default=0)
	longitude=models.FloatField(default=0)
	RationPerMillion=models.IntegerField(default=0)
	TotalDeaths=models.IntegerField(default=0)
	NewCases=models.IntegerField(default=0)
	TotalCases=models.IntegerField(default=0)
	bnName=models.CharField(max_length=50,default="")
	name=models.CharField(max_length=50,default="")
	TotalRecovered=models.IntegerField(default=0)
	NewDeaths=models.IntegerField(default=0)
	ActiveCases=models.IntegerField(default=0)
	SeriousCases=models.IntegerField(default=0)

class District(models.Model):
	date=models.DateTimeField(auto_now_add=True)
	jsonData=models.TextField()

	def __str__(self):
		return self.jsonData