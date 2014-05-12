$(document).ready(function(){
	$.ajax({
		url: "http://hirose.sendai-nct.ac.jp/~sue/wattmon/5min.csv",
		//url: "http://dataforjapan.org/dataset/54f270dc-817d-465a-baa9-3a221ce3b962/resource/5cdf7c23-c19d-44d0-a389-ae09403de745/download/sapporoculturalpropertylocation.csv",
		type:"GET",
		chache: false ,

		success:function(res){
			content = $(res.responseText).text();
			console.log("content:",content);
			var dataset = text2csv(content);
			make_graph(dataset);
		}
	});
});

function text2csv(text){
	/*
	�f�[�^
	��� y/m/d h:m:s, #n#, value y/m/d.... LFLF
	���������ςɋ󔒂������₪�����f�[�^�𐮌`����csv�ɂ���
	*/
	//LF�������폜
	var lf = String.fromCharCode(10);
	text = text.replace(lf,"");
	// �擪�̓�󔒂��폜���Ă��
	var n = text.search(/\d/);
	if( n != -1){
		text = text.slice(n);
	}

	// �m�F
	console.log("remove space:",text);
	// ���t�Ǝ����̊Ԃ��󔒂Ȃ̂ŁA�������J���}�ɒu��������
	// #n#�̑O�ɂ���󔒂�����̂ō폜
	// value�̑O�ɂ���󔒂�����̂ō폜
	// �s���Ƃ̋�؂���󔒂Ȃ̂ŁA�����܂��̂܂�
	// num ����߂̋󔒂�
	var num = 1;
	for(var i=0;i<text.length;i++){
		if(text.charAt(i) == " "){
			if(num != 4){
				text = text.slice(0,i-1) + "," + text.slice(i+1);
				num += 1;
			} else{
				num = 1;
			}
		}
	}
	// �m�F
	console.log("replaced text:",text);
	// �s���Ƃ̋�؂肪�󔒂Ȃ̂ŋ󔒂Ŕz�����؂�
	data = text.split(" ");
	// �m�F
	console.log("data:" , data);
	// �e�s�̃f�[�^�̋�؂�̓J���}�Ȃ̂ŃJ���}���Ƃɔz�������ɋ�؂�
	for(var i=0;i<data.length;i++){
		data[i] = data[i].split(",");
	}
	// �m�F
	console.log("failinged data:",data);
	// �e�f�[�^�𐔒l�ɕϊ�
	for(var i=0;i<data.length;i++){
		data[i][3] = parseInt(data[i][3]);
	}
	// �m�F
	console.log("numbered data:",data);

	return data;
}

function make_graph(dataset){
	var w = 1000;
	var h = 400;
	var barPadding = 1; // �_�Ɩ_�̊Ԃ̊Ԋu
	var axisPadding = 20; // �O���t�Ǝ��̊Ԋu

	// scale
	var yScale = d3.scale.linear()
			.domain( [0, 500] )
			.range([0,h]);

	// axis
	var yAxis = d3.svg.axis()
		      .scale(yScale)
		      .orient("right");
	

	var svg = d3.select("body")
			.append("svg")
			.attr("height",h)
			.attr("width",w);

	console.log("svg:",svg);

	svg.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")	
		.attr( {
			x : function(d,i){ return i * ( (w-axisPadding) / dataset.length) + axisPadding;   },
			y : function(d){ return h - yScale(d[3]) - axisPadding; },
			width : (w-axisPadding) / dataset.length - barPadding,
			height : function(d){ return yScale(d[3]);  },
			fill : function(d,i){ 	if(i % 10 == 0){
							return '#9bbb59';
						} else{
							return '#6fbadd';
						}
					}
			} );

	svg.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.text(function(d){ return d[1]; })
		.attr( {
			x : function(d,i){ return i * (w / dataset.length); } ,
			y : function(d,i){ if(i % 10 == 0){
						return h;
					   }
					} ,
			fill : '#9bbb59'
			} );
	
	// Axis�̕\��
	svg.append("g")
		.attr("class","axis")
		.attr("transform", "translate(0,0)")
		.call(yAxis);
}
