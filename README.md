# ZKWS - zero knowledge wallet services

# zkws

Data File Sync Service

Data file sync service, is used to allow browsers to share sets of files, using a unique secret phrase to give access to the shared data files.

The shared file data is held in each client browser in their indexed DB browser storage. This allows web applications to access these files and to use them during the application execution, much like files are used in web applications that are located on a web server.

Initial data file sync service will be made up of;
* fileAPI node(s)    
* client browser nodes

file API functionality;
* sync client Hashes
* calc client sync files
* request client file
* send client file

data structures file API;
* array of sync ids
* array of encrypted files for each client id and sync id
* array of file hashes owned by each client id and sync id
* ???


The client browser functionality;
* register or generate client id
* add files
* generate new sync code
* register on sync code 
* publish files
* sync send file(s)
* sync request file(s)

Data structures client browser;
* sync id address
* client id address
* array of files
* ???

Network communication will use post request between client and files API servcie. The files API will run as a service and revenue will be able to be generated through provsiom of sync data strage and distrabution. I initial version this will with standard http ost request over tcp. In future we could givethe option for people/organisations to host to host their own files API saving them the strage transfer costs. The files API can also be extended to use a p2p network setup but this will be part of the next stage of development.


## zkws - APPS

ws-email-service  ws-relay-service  ws-smart-contracts
