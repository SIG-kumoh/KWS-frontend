import "../../css/_page_header.css"

export default function PageHeader(page_name: string) {
    return (
        <div className="page_header">
            <h1>{page_name}</h1>
        </div>
    )
}