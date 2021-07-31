const { createWriteStream } = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('streamfile.proto', {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const filePackage = grpcObject.streamfile;

const client = new filePackage.FileService('localhost:5000', grpc.credentials.createInsecure());

const stream = createWriteStream('./output/download.txt');
const call = client.download();

call.on('data', (item) => {
  stream.write(item.message);
});

call.on('end', (e) => {
  stream.end();
  console.log('File downloaded successfully!');
});
