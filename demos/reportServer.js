var serverIp = "192.168.21.42:8080";
var serverWs = "ws://"+serverIp+"/reportSocket";
var chartServer = (function() {
	var websocket = null;
	var reconnectTimer = null;
	var db = {};
	var defaultSqls = [];
	function connect(){
		//判断当前浏览器是否支持WebSocket
		if ('WebSocket' in window) {
			websocket = new WebSocket(serverWs);
		} else {
			alert('你的浏览器不支持 websocket, 请更新浏览器！！！')
		}
		//连接发生错误的回调方法
		websocket.onerror = function() {
			console.log("connect error");
		};

		//连接成功建立的回调方法
		websocket.onopen = function() {
			console.log("ws successfully connect to %c %s ", "color:blue;text-decoration:underline;", serverWs);
			if (reconnectTimer) {
				clearInterval(reconnectTimer);
			}
		};

		//接收到消息的回调方法
		/**
		 * @param event
		 * @param {Array} data.machineInfo [机器的列表]
		 * @param {Array} data.alertInfo [机器报警的列表]
		 */
		websocket.onmessage = function(event) {
			var e = event || window.event;
			if(e.data){
				var chartData = JSON.parse(e.data).data;
				console.log(chartData);
			}else{
				console.log(e)
			}
		};

		//连接关闭的回调方法
		websocket.onclose = function() {
			console.log("ws disconnected to %c %s ", "color:blue;text-decoration:underline;", serverWs);
			if (!reconnectTimer) {
				reconnectTimer = setInterval(connect, 5000);
			}
		};

		//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
		window.onbeforeunload = function() {
			websocket.close();
		}
	}
	connect();
	db.query  = function(sql, startTime, endTime){
		var startUtc = new Date(startTime).getTime(),
			endUtc = new Date(endTime).getTime();
		var message = JSON.stringify({
			sql: sql,
			beginTime: startUtc,
			endTime: endUtc,
			siloId: "default",
			timeField: "tms",
			timeFlag: true
		});
		Cookies.set('startTime', startUtc,{ expires: 7, path: '' });
		Cookies.set('endTime', endUtc,{ expires: 7, path: '' });
		Cookies.set('querySql', sql,{ expires: 7, path: '' });
		websocket.send(message);
	}
	return db;
})();
$(function(){
	var defaultSql = ["select * from alert where entity plike \"502\" and ( message plike \"良率\" or message plike \"弹片\")  limit 100;","    select entity, count(message)  from alert group by entity order by count(message)  limit 100;",3];
	var sqlSelector = document.getElementById('defaultsql');
	sqlSelector.addEventListener('change',function(){
		var sqlIndex = parseInt(this.value);
		if(sqlIndex >= 0){
			document.getElementById('sql').value = defaultSql[sqlIndex];
		}
	});
	defaultSql.forEach(function(d,i){
		var sqlOpt = document.createElement("option");
		sqlOpt.innerHTML = d;
		sqlOpt.value = i;
		sqlSelector.appendChild(sqlOpt);
	});
	document.getElementById('query').addEventListener('click',function(){
		var sql = document.getElementById('sql').value;
		var startTime = document.getElementById('startTime').value;
		var endTime = document.getElementById('endTime').value;
		chartServer.query(sql, startTime, endTime);
	});
	if(Cookies.get('querySql')){
		document.getElementById('sql').value = Cookies.get('querySql');
	}
	flatpickr('#startTime',{
		enableTime:true,
		enableSeconds:true,
		timeFormat:"h:i:S K",
		minuteIncrement : 1,
		defaultDate: Cookies.get('startTime') ? new Date(parseInt(Cookies.get('startTime'))) : null
	});
	flatpickr('#endTime',{
		enableTime:true,
		enableSeconds:true,
		timeFormat:"h:i:S K",
		minuteIncrement : 1,
		defaultDate: Cookies.get('endTime') ? new Date(parseInt(Cookies.get('endTime'))) : null
	});
})