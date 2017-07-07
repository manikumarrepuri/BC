module.exports ={
  "tableName": "disks",
  "group": "",
	"fields": [
		{
			"name": "sequenceNumber",
			"type": "unknown"
		},{
			"name": "customerId",
			"type": "unknown"
		},{
			"name": "dateTime",
			"type": "unknown"
		},{
			"name": "timeOfDay",
			"type": "unknown"
		},{
			"name": "computerName",
			"type": "unknown"
		},{
			"name": "diskName",
			"type": "entity"
		},{
			"name": "diskVolumeName",
			"type": "unknown"
		},{
			"name": "diskSize",
			"type": "mb"
		},{
			"name": "diskFree",
			"type": "%"
		},{
			"name": "diskUsed",
			"type": "%"
		},{
			"name": "diskIo",
			"type": "s"
		},{
			"name": "diskRate",
			"type": "B"
		},{
			"name": "diskAvgIoSize",
			"type": "unknown"
		},{
			"name": "diskAvgIo",
			"type": "ms"
		},{
			"name": "diskBusy",
			"type": "%"
		},{
			"name": "diskBusyRead",
			"type": "%"
		},{
			"name": "diskBusyWriting",
			"type": "%"
		},{
			"name": "diskQueueLength",
			"type": "int"
		}
	]
}
