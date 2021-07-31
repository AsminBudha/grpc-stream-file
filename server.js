const { createReadStream } = require('fs');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('streamfile.proto', {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const filePackage = grpcObject.streamfile;

const server = new grpc.Server();
server.bind('localhost:5000', grpc.ServerCredentials.createInsecure());

server.addService(filePackage.FileService.service, {
  download,
});

server.start();

function download(call, callback) {
  let stream = createReadStream('./resources/itcont.txt');

  stream.on('data', (data) => {
    call.write({ message: data });
  });

  stream.on('close', () => {
    call.end();
  });
}
