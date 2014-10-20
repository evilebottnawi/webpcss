var WebpBase64 = require("../lib/WebpBase64"),
    base64stub = require("./fixtures/base64"),
    fs = require("fs"),
    should = require("should");

describe("base64", function(){
  var base64 = new WebpBase64();

  it("test base64 data", function(){
    new Buffer(base64stub.png_base64, "base64").toString().should.eql(
      base64stub.png_bin.toString()
    )
  });

  it("extract png", function(){
    var png = "data:image/png;base64,iVBORw";
    var url_png = "url(" + png + ")";
    var res = base64.extract(png);
    res.should.be.instanceof(Array).and.have.lengthOf(1);
    [{format: "png",data: "iVBORw"}].should.eql(res)

    res = base64.extract(url_png, true);
    res.should.be.instanceof(Array).and.have.lengthOf(1);
    [{format: "png",data: "iVBORw"}].should.eql(res)

    res = base64.extract(base64stub.png_uri);
    res.should.be.instanceof(Array).and.have.lengthOf(1);
    [{format: "png",data: base64stub.png_base64}].should.eql(res);
  });

  it("extract multiple png", function(){
    var png = "data:image/png;base64,iVBORw";
    var url_png2 = "url(" + png + "), url(" + png + ")";
    res = base64.extract(url_png2, true);
    res.should.be.ok;
  });

  it("extract breaking data", function(){
    [{format: "url", data:"data:_image/png;base64,iVBORw"}].should.eql(
      base64.extract("data:_image/png;base64,iVBORw")
    );

    [{format: "url", data:"data_:image/png;base64,iVBORw"}].should.eql(
      base64.extract("data_:image/png;base64,iVBORw")
    );

    [{format: "url", data:"data:image/pngbase64,iVBORw"}].should.eql(
      base64.extract("data:image/pngbase64,iVBORw")
    );

    [{format: "url", data:"data:image/png;base64iVBORw"}].should.eql(
      base64.extract("data:image/png;base64iVBORw")
    );
  });

  it("test convert data", function(next){
    base64.convert({format: "png",data: base64stub.png_bin}, function(err, data){
      if(err === null){
        (err === null).should.be.ok;
      } else {
        err.should.be.eql("");
      }
      data.should.instanceof(Buffer);
      next();
    });
    (true).should.be.ok;
  });
  xit("test webp", function(next){
    base64.webp("url(" + base64stub.png_uri + ")", true, function(err, data){
      if(err === null){
        (err === null).should.be.ok;
      } else {
        err.should.be.eql("");
      }
      data.should.instanceof(Buffer);
      next();
    });
  });
});
