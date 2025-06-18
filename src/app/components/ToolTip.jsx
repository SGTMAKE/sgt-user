export default  function ToolTip(){
    return<>
        <div className="hidden md:block m-3 sticky text-gray-600 bg-white text-sm">
            <div className="flex justify-between px-5">
                <div className="">
                    <ul className="flex gap-5">
                        <li>Fastner</li>
                        <li>Tools</li>
                        <li>EV Parts</li>
                        <li>Connectors & Wires</li>
                    </ul>
                </div>
                <div className="">
                    <ul className="flex gap-5">
                        <li>Location</li>
                        <li>Track Orders</li>
                        <li>Help Center</li>
                    </ul>
                </div>
            </div>
        </div>
    </>
}