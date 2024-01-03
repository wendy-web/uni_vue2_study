// 入参两个坐标（字符串格式："114.30911,30.600052"）,num是返回坐标点个数
export default function(point_start,point_end,num){
  //第一步把坐标字符串转为对象,为了方便计算转为了数字格式
  var p_start={x:parseFloat(point_start.split(",")[0]), y:parseFloat(point_start.split(",")[1])};
  var p_end={x:parseFloat(point_end.split(",")[0]),y:parseFloat(point_end.split(",")[1])};
  //此处敲黑板，是任务的第二大难点，求出相对的第三个点，用于固定曲线的弯曲度，下面公式是已知三角形两点坐标和两个坐标点的夹角求第三点坐标，两个夹角我们是自定义任意值，不过不要加起来超过180度
  // 已知两点p1(x1,y1)、p2(x2,y2)和两点所对应的角度A和B,x3、y3是对应第三点的坐标，cot25°=2.14
  //x3 = (x1*cotB+x2*cotA+y2-y1)/(cotA+cotB)
  //y3 = (y1*cotB+y2*cotA+x1-x2)/(cotA+cotB)
  let x3=(p_start.x*2.14+p_end.x*2.14-p_start.y+p_end.y)/(2*2.14)
  let y3=(p_start.y*2.14+p_end.y*2.14-p_end.x+p_start.x)/(2*2.14)
  var p_crt1={x:x3,y:y3};
  var p_crt2={x:x3,y:y3};
  //下面计算贝叶斯曲线，不是几个字能说清，直接拿去用没毛病
  /**
   * 计算公式：
   *                  | 1  0  0   0|  |P0|
   * [1 t t*t  t*t*t] |-3  3  0   0|  |P1|
   *                  |3  -6  3   0|  |P2|
   *                  |-1  3  -3  1|  |p3|
   *
   * **/
  let paths=[];
  for(let i=0;i<num+1;i++){
    let t=i/num;
    var _matrix1=[1,t,t*t,t*t*t];
    var _matrix2=[
       [1,0,0,0]
      ,[-3,3,0,0]
      ,[3,-6,3,0]
      ,[-1,3,-3,1]
    ];
 
    var _matrix3=[
      [p_start.x,p_start.y]
      ,[p_crt1.x,p_crt1.y]
      ,[p_crt2.x,p_crt2.y]
      ,[p_end.x,p_end.y]
    ];
    var _matrix_tmp=[
      _matrix1[0]*_matrix2[0][0]+_matrix1[1]*_matrix2[1][0]+_matrix1[2]*_matrix2[2][0]+_matrix1[3]*_matrix2[3][0]
      ,_matrix1[0]*_matrix2[0][1]+_matrix1[1]*_matrix2[1][1]+_matrix1[2]*_matrix2[2][1]+_matrix1[3]*_matrix2[3][1]
      ,_matrix1[0]*_matrix2[0][2]+_matrix1[1]*_matrix2[1][2]+_matrix1[2]*_matrix2[2][2]+_matrix1[3]*_matrix2[3][2]
      ,_matrix1[0]*_matrix2[0][3]+_matrix1[1]*_matrix2[1][3]+_matrix1[2]*_matrix2[2][3]+_matrix1[3]*_matrix2[3][3]
    ];
 
    var _matrix_final=[
      _matrix_tmp[0]*_matrix3[0][0]+_matrix_tmp[1]*_matrix3[1][0]+_matrix_tmp[2]*_matrix3[2][0]+_matrix_tmp[3]*_matrix3[3][0]
      ,_matrix_tmp[0]*_matrix3[0][1]+_matrix_tmp[1]*_matrix3[1][1]+_matrix_tmp[2]*_matrix3[2][1]+_matrix_tmp[3]*_matrix3[3][1]
    ];
     //下面注释掉的原因是入参是经纬度，但leaflet渲染需要的是纬度在前经度在后的数组，然后你懂的
    // var _res_point={
    //   x:_matrix_final[0]
    //   ,y:_matrix_final[1]
    // };
    // var _res_point=[_matrix_final[1],_matrix_final[0]];
    paths.push({
		latitude:_matrix_final[1],
		longitude:_matrix_final[0]
	});
  }
  return paths;
}