import Image from "next/image"
import construction from "public/underconstruction.jpg"

export default function Login(){
    return(
        <div className="grid grid-flow-col grid-cols-1 items-center" style={{height: "80svh"}}>
            <div className="grid grid-flow-row justify-center">
                <Image
                    src={construction}
                    alt="Error 404" 
                    className="rounded-xl shadow" width={500} height={500}
                />
                
                <h3 className="text-lg text-center">Sorry, you got here early</h3>
                
                <p>
                    This part of the site is still under construction, please come back later
                </p>
            </div>

        </div>
    );
}