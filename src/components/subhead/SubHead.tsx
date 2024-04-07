import "./sub_head.css";

export default function SubHead(name: string) {
    return (
        <div className="sub_head">
            <h3>{name}</h3>
        </div>
    )
}