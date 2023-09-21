import { SetStateAction } from "react";
import { Form } from "react-bootstrap";



export function LoadFile({content, setContent, setNames}:
    {content:[...string[]][];
    setContent: React.Dispatch<SetStateAction<[...string[]][]>>;
    setNames: React.Dispatch<SetStateAction<string[]>>;}
    ): JSX.Element {
    function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
        // Might have removed the file, need to check that the files exist
        if (event.target.files && event.target.files.length) {
            // Get the first filename
            const filename = event.target.files[0];
            // Create a reader
            const reader = new FileReader();
            // Create lambda callback to handle when we read the file
            reader.onload = (loadEvent) => {
                // Target might be null, so provide default error value
                const newContent =
                    loadEvent.target?.result || "Data was not loaded";
                // FileReader provides string or ArrayBuffer, force it to be string
                //Pass it into setContent in the array form we use for the graphs
                setContent(JSON.parse(newContent as string).map((x: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.entries(x)));
                setNames(content.map(x => x[0][1].toString().toLowerCase()));
            };
            // Actually read the file
            reader.readAsText(filename);
        }
    }

    return (
        <div>
            <div className="uploadFile"> 
                <Form.Group controlId="exampleForm">
                    <Form.Control type="file" onChange={uploadFile} />
                </Form.Group> 
            </div>
        </div>
    );
}