function convert20(obj){
  if (argv.verbose) console.log('Converting OpenAPI 2.0 definition');
  swagger2openapi.convertObj(obj,{patch:true,anchors:true,warnOnly:true,direct:true},function(err,openapi){
      if (err) {
          console.error(util.inspect(err));
      }
      else {
          config.defaults.swagger = obj;
          despatch(openapi,config,configName,finish);
      }
  });
}