
function convert12(api){
  if (argv.verbose) console.log('Converting Swagger 1.2 definition');
  let options = {};
  options.source = defName;
  var aBase = options.source.split('/');
  var filename = aBase.pop();
  var extension = '';
  if (filename.endsWith('.json')) {
      extension = '.json';
  }
  else if (filename.endsWith('yaml')) {
      extension = '.yaml';
  }
  else {
      aBase.push(filename);
  }
  let base = aBase.join('/');

  //if (options.source.endsWith('.json') || options.source.endsWith('.yaml')) {
  //    extension = '';
  //}

  var retrieve = [];
  var apiDeclarations = [];
  if (api.apis) {
      for (var component of api.apis) {
          component.path = component.path.replace('.{format}','.json');
          var lbase = base;
          if (component.path.startsWith('/')) {
              let up = url.parse(base);
              lbase = up.protocol + '//' + up.host;
          }
          if ((base.endsWith('/')) && (component.path.startsWith('/'))) {
              lbase = base.substr(0,base.length-1);
          }
          if (component.path.indexOf('://')>=0) {
              lbase = '';
          }

          var u = (lbase+component.path);
          if (!u.endsWith(extension)) u += extension;
          if (argv.verbose) console.log(u);
          retrieve.push(fetch(u,options.fetchOptions)
          .then(res => {
              if (argv.verbose) console.log(res.status);
              return res.text();
          })
          .then(data => {
              apiDeclarations.push(yaml.parse(data));
          })
          .catch(err => {
              console.error(util.inspect(err));
          }));
      }
  }

  co(function* () {
    // resolve multiple promises in parallel
    var res = yield retrieve;
    var sVersion = 'v1_2';
    stools.specs[sVersion].convert(api,apiDeclarations,true,function(err,converted){
        if (err) {
            console.error(util.inspect(err));
        }
        else {
            if (converted.info && !converted.info.version) {
                converted.info.version = '1.0.0';
            }
            convert20(converted);
        }
    });
  });
}