module.exports = {
	"group": "{{#xif class '==' 'AgentUpdate'}}AgentUpdater{{else}}{{context0}}-{{context1}}-{{context2}}-{{context3}}-{{context4}}{{/xif}}",
	"fields": [
		{
			"name": "valid",
			"type": "unknown"
		},
		{
			"name": "host",
			"type": "unknown"
		},
		{
			"name": "date",
			"type": "unknown"
		},
		{
			"name": "time",
			"type": "unknown"
		},
		{
			"name": "state",
			"type": "string"
		},
		{
			"name": "class",
			"type": "string"
		},
		{
			"name": "subClass",
			"type": "string"
		},
		{
			"name": "severity",
			"type": "integer"
		},
		{
			"name": "handleNo",
			"type": "integer"
		},
		{
			"name": "handleName",
			"type": "string"
		},
		{
			"name": "context",
			"type": "unknown"
		},
		{
			"name": "creationDate",
			"type": "date"
		},
		{
			"name": "creationTime",
			"type": "time"
		},
		{
			"name": "closeDate",
			"type": "date"
		},
		{
			"name": "closeTime",
			"type": "time"
		},
		{
			"name": "updateCount",
			"type": "string"
		},
		{
			"name": "problemOwner",
			"type": "string"
		},
		{
			"name": "briefText",
			"type": "string"
		},
		{
			"name": "fullText",
			"type": "string"
		}
	]
}
