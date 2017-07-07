#!/bin/bash

#Check that the required number of arguments have been received
if [ !  $# -eq 2 ]; then
  echo "Incorrect number of arguments supplied"
  exit 401
fi

siteId=$1;
server=$2;
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#include JSON Parser
source "./json.sh"

#function to return array of values for a given token
getValue() {
  "tokenize" | "parse" | grep "\"$1\"\]" | cut -s -f 2
}

getUrl() {
  #Generate hmac
  appId="agentUpdater"
  secret="g%^17-+!45@#\$2367!4def&*abc"
  timestamp=$(date +%s)
  sig=$(echo -n $appId$secret$timestamp | sha1sum)
  auth_header="Authorization:Itheon $sig"

  #Call the url and get the json
  local result=$(wget "$1" --header="$auth_header" --header="Date:$timestamp" -q -O -) || $(curl -L -H "$auth_header" -H "Date:$timestamp" "$1")

  if [ ! result ] ; then
    echo >&2 "Please install wget or curl. Aborting."
    exit 1
  fi

  echo "$result"
  return 1;
}

#main function
ttest () {
  local newVersionFile=$(getUrl "http://127.0.0.1/agent-update/$siteId::$server/versions")
  local versionFile="$DIR/versions.json"

  #if we don't have a version file create one and we're done here
  if [ ! -f $versionFile ]; then
    echo "$newVersionFile" > $versionFile
    exit 0
  fi

  #load in the contents of the version file
  currentVersionFile=$(<$versionFile)

  #parse the JSON and get an array of ruleNames and versions
  currentNames=($(echo "$currentVersionFile" | getValue "name"))
  currentVersions=($(echo "$currentVersionFile" | getValue "version"))

  #parse the JSON and get an array of ruleNames and versions
  newNames=($(echo "$newVersionFile" | getValue "name"))
  newVersions=($(echo "$newVersionFile" | getValue "version"))

  #Array to store any changed rules
  changed=()

  #loop through the new version file
  for key in "${!newNames[@]}"
  do
    #loop through the old version file
    for id in "${!currentNames[@]}"
    do
      #see if we can find a rule with the same name
      if [ "${currentNames[$id]}" = "${newNames[$key]}" ]; then
        #check if the version is newer
        if [ "${newVersions[$key]}" -gt "${currentVersions[$id]}" ]; then
          changed+=("$key:$id")
        fi

        #regardless we're done in this loop
        break
      fi
    done
  done

  #create an array to store any invalid rules
  invalid=()

  #handle any changed rules
  for change in "${changed[@]}"
  do
    #split out the ids
    local split=$(echo $change | tr ":," "\n")
    ids=()
    for id in $split
    do
      ids+=("$id")
    done

    #remove "" around the ruleName
    local name=$(echo ${newNames[${ids[0]}]} | tr -d '"')
    #Retrieve the file contents
    local content=$(getUrl "http://127.0.0.1/agent-update/$siteId::$server/$name:${newVersions[${ids[0]}]}")
    #Create a temporary file
    local tmpfile=$(mktemp)
    echo "$content" > $tmpfile

    #check the rule is valid
    # local valid=$(/opt/iAM/product/iAM_command -Rv -f $tmpfile -c $tmpfile.crl)
    #remove the tmp file
    rm $tmpfile

    #if [ ! valid = "" ]; then
    #  invalid+=("$name")
    #  break
    #fi

    #update file
    echo "$content" > "$DIR/$name.rul"

    #update the version file
    sed -i -e "s/\"name\":${currentNames[${ids[1]}]},\"version\":${currentVersions[${ids[1]}]}/\"name\":${newNames[${ids[0]}]},\"version\":${newVersions[${ids[0]}]}/g" "$DIR/versions.json"
  done

  #If we've got any invalid rules let everyone know!
  if [ ! ${#invalid[@]} -eq 0 ]; then
    local eventDate=$(date +%d-%b-%Y | tr '[a-z]' '[A-Z]')
    local eventTime=$(date +%H:%M:%S)

    #handle any invalid rules
    for error in "${invalid[@]}"
    do
      #Write out an event to state we had an invalid rule
      echo "7#1#$siteId::$server#$eventDate#$eventTime#N#AgentUpdater#ITHEON#2#0##Attempt to install an invalid rule: $name#$eventDate#$eventTime###Attempt to install an invalid rule: $name version: ${ids[1]}##" >> "invalid_rules.evt"
    done
  fi

}
ttest
