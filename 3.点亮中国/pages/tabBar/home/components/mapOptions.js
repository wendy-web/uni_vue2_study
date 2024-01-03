export default {
	markerLabel:function(name){
		return {
			content:name,
			color:'#000018',
			padding:0,
			bgColor:'transparent',
			textAlign:'center'
		}
	},
	markerCallout:function(name){
		return {
			 content:name,
			 color:'transparent',
			 padding:0,
			 fontSize:0,
			 bgColor:'transparent',
			 textAlign:'center',
			 display:'ALWAYS'
		}
	}
}