let nginxPath = '/1/11';
if(nginxPath){
  if(nginxPath[nginxPath.length - 1] !== '/'){
    nginxPath += '/';
  }
}
console.log(nginxPath);
