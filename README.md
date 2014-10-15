
	//添加拖拽边框的实例创建
    //$(DIV).Qresize( { minWidth : 200 , minHeight : 200}  );

    //拖拽的使用方法
	//$(DIV).Drag( {range : { top : 100 ,left: 200, x : 500 , y : 600}} );
	//$(DIV).Drag( {clientScreen : false } );

    
    $("#div1").DragReize({ minWidth : 200 , minHeight : 200, clientScreen : false});
    $("#div2").DragReize({ minWidth : 200 , minHeight : 200, clientScreen : true});
    $("#div3").DragReize({ minWidth : 200 , minHeight : 200, clientScreen : false ,
        range : { top : 100 ,left: 200, x : 500 , y : 600}
    });

