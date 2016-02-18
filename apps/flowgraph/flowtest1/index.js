define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$services$, map, webrequest, $flow$controllers$, xypad, knob, keyboard, dpad, $flow$displays$, labtext) {
	this.render = function() {
		return [
			xypad({name:"xypad0", flowdata:{x:23, y:316}}),
			labtext({name:"labtext0", flowdata:{x:290, y:164}, vec2:wire("this.rpc.xypad0.pointerpos"), string:wire("this.rpc.dpad0.value")}),
			dpad({name:"dpad0", flowdata:{x:71, y:59}})
		]
	}
}
)