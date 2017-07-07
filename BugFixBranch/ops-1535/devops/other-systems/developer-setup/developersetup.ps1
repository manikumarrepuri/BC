$caCertUrl = "http://certificates.appdev.bluechipdomain.co.uk/certsrv/certnew.cer?ReqID=CACert&Renewal=0&Mode=inst&Enc=b64"
$output = "$env:TEMP\appdev.ca.pfx"
Write-Host -NoNewline Downloading CA certificate...
Invoke-WebRequest -Uri $caCertUrl -OutFile $output
Write-Host done.
$pfx = new-object System.Security.Cryptography.X509Certificates.X509Certificate2 
$pfx.import($output,"","Exportable,PersistKeySet")


foreach ($location in @("CurrentUser", "LocalMachine")) {
  Write-Host -NoNewline "Installing Application Development Root CA to $location" 
  $store = new-object System.Security.Cryptography.X509Certificates.X509Store([System.Security.Cryptography.X509Certificates.StoreName]::Root,$location)
  $store.open("MaxAllowed") 
  $store.add($pfx) 
  $store.close()
  Write-Host done.
}