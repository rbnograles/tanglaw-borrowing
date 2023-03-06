import React, {useState, useEffect} from 'react';
import DraggableDialog from '../../components/Modal';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarComponent from '../../components/Snackbar';
import { Button } from '@mui/material';
import { getSchoolYears } from '../../utilities/schoolYears';
import { departments } from '../../utilities/departments';
import { Documents } from '../../context/DocumentsContext';
import { UserProfile } from '../../context/UsersProfileContext';
import { SystemLogs } from '../../context/LogsContext';

const CreateDocument = ({ 
    open,
    handleOpen, 
    handleClose,
    isLoading,
    processLabel,
    actionSuccess,
    refresh,
    //snack
    setOpenSnackbar,
    setMessage,
    setSnackbarType,


}) => {
    const { createSystemLogs } = SystemLogs();
    const { getUserProfile  } = UserProfile();
    const { createDocument } = Documents();
    const schoolYears = getSchoolYears();
    const currentDate = new Date();
    const [loggedInProfile, setLoggedInProfile] = useState({ userType: ""});
    const [file, setFile] = useState(null);
    const [document, setDocument] = useState({
        abstract: "",
        authors: [],
        citations: [],
        department: "",
        documentName: "",
        fileName: "",
        keywords: [],
        schoolYear: "",
        visitLogs: [],
        binned: false,
        publicationDate: currentDate.toISOString(),
        ownerId: localStorage.getItem("uid"),
        advisers: [],
        languages: [],
        formats: [],
        shelfLocation: "",
        physicalDescription: [],
    })

    const callCreateDocument = async (val, f) =>{
        try{
            const results = await createDocument(val, f);
            const logs = await createSystemLogs("Created a new document.", loggedInProfile.email, loggedInProfile.userType);
            setOpenSnackbar(true);
            setMessage(`Document Created`);
            setSnackbarType('success');
            refresh();
        }catch{
            setOpenSnackbar(true);
            setMessage(`Document Createion Failed`);
            setSnackbarType('error');
        }
    }

    const submit = () => {
        let noError = false;
        for (const [key, value] of Object.entries(document)) {
            if(value === ""){
                setOpenSnackbar(true);
                setMessage(`${key} is empty`);
                setSnackbarType('error');
                return;
            } 
            if(key === "keywords"||key==="citations"||key==="authors"||key ==="languages"||key==="advisers"||key==="formats"||key==="physicalDescription"){
                let countEmpty = 0;
                if(value.length !== 0){
                    value.forEach(val=>{
                        if(val === ""){
                            setOpenSnackbar(true);
                            setMessage(`one of your ${key} is empty`);
                            setSnackbarType('error');
                            countEmpty++;
                        }
                    })
                }
                if(countEmpty !== 0){
                    return;
                }
            }
            if(key === "keywords" || key === "authors"||key ==="languages"||key==="advisers"||key==="formats"||key==="physicalDescription"){
                if(value.length === 0) {
                    setOpenSnackbar(true);
                    setMessage(`${key} is empty`);
                    setSnackbarType('error');
                    return;
                }
            }
            if(file === null || file === undefined){
                setOpenSnackbar(true);
                setMessage(`File is empty`);
                setSnackbarType('error');   
                return;
            }
            if(!file.name.includes('pdf')){
                setOpenSnackbar(true);
                setMessage(`File is not a PDF`);
                setSnackbarType('error');
                return;
            }
            noError = true;
        }
        if(noError){
            callCreateDocument(document, file);
            setDocument({
                abstract: "",
                authors: [],
                citations: [],
                department: "",
                documentName: "",
                fileName: "",
                keywords: [],
                schoolYear: "",
                visitLogs: [],
                binned: false,
                publicationDate: currentDate.toISOString(),
                ownerId: localStorage.getItem("uid"),
                advisers: [],
                languages: [],
                formats: [],
                shelfLocation: "",
                physicalDescription: [],
            })
            setFile(null);
            actionSuccess()
        }
    }

    const handleChange = (prop) => (event) => {
        setDocument({ ...document, [prop]: event.target.value });
    };

    const _getUserProfile = async () => {
        try {
            const data = await getUserProfile(localStorage.getItem("uid"));
            setLoggedInProfile(data[0]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        _getUserProfile();
    },[])

    const handleArrayChange = (index, prop) => (event) =>{
        let newArray = document[prop];
        newArray[index] = event.target.value;
        setDocument({ ...document, [prop]: newArray});
    }

    const addItem = (prop) => {
        let newArr = document[prop]; 
        newArr.push("");
        setDocument({ ...document, [prop]: newArr});
    };

    const removeItem = (prop, index) => {
        let newArr = document[prop]; 
        newArr.splice(index,1)
        setDocument({ ...document, [prop]: newArr });
    };

    return (
        <DraggableDialog
            open={open}
            maxWidth="lg"
            title="Create Document"
            handleOpen={handleOpen}
            handleClose={handleClose}
            isLoading={isLoading}
            processLabel={processLabel}
            label="create document"
            handleAction={()=>submit()}
        >   
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '100%' },
                    }}
                    autoComplete="off"
                    id="createDocumentForm"
                >
                    <p style={{ fontWeight: "bold", marginLeft: "5px"}}>Document Details</p>
                    <div className='flex flex-row'>
                        <TextField
                            id="outlined-helperText"
                            label="Document Name"
                            onChange={handleChange("documentName")}
                            value={document.documentName}
                            required
                        />
                        <TextField
                            id="outlined-helperText"
                            label="File Name"
                            onChange={handleChange("fileName")}
                            value={document.fileName}
                            required
                        />
                    </div>
                    <div className='flex flex-row mt-2'>
                        <FormControl sx={{ m: 1, width: "100%" }}>
                            <InputLabel id="demo-simple-select-autowidth-label">Department</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={document.department}
                                onChange={handleChange("department")}
                                label="Department"
                                required
                            >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {departments.map((dep)=>{
                                return(<MenuItem key={dep} value={dep}>{dep}</MenuItem>)
                            })}
                            </Select>
                        </FormControl>    
                        <FormControl sx={{ m: 1, width: "100%" }}>
                            <InputLabel id="demo-simple-select-autowidth-label">School Year</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={document.schoolYear}
                                onChange={handleChange("schoolYear")}
                                label="School Year"
                                required
                            >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {schoolYears.map((sy)=>{
                                return(<MenuItem key={sy} value={sy}>{sy}</MenuItem>);
                            })}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='flex flex-row mt-2'>
                        <TextField
                            accept=".pdf"
                            id="raised-button-file"
                            type="file"
                            onChange={e=>setFile(e.target.files[0])}
                            required
                        />
                        <TextField
                            id="outlined-helperText"
                            label="Shelf Location"
                            onChange={handleChange("shelfLocation")}
                            value={document.shelfLocation}
                            required
                        />
                    </div>
                    <div className='flex flex-row mt-2'>
                        <TextField
                            id="outlined-helperText"
                            label="Abstract"
                            onChange={handleChange("abstract")}
                            multiline
                            rowsMax={4}
                            onKeyDown={(e) => {
                                if(e.key === 13 && !e.shiftKey) {
                                    e.preventDefault();
                                    setInputValue("");
                                }
                            }}
                            value={document.abstract}
                            required
                        />
                    </div>
                    <div className='flex flex-row mt-2'>
                        <Button variant="outlined" onClick={()=>addItem("authors")}>Add Author +</Button>
                    </div>
                    <div className='flex flex-wrap mt-2'>
                        {document.authors.map((author, index)=>{
                            return(
                                <TextField
                                    key={`author${index}`}
                                    sx={{m: 1, flex: "1 0 21%"}}
                                    id="outlined-helperText"
                                    label={`Author ${index+1}`}
                                    onChange={handleArrayChange(index, "authors")}
                                    value={document.authors[index]}
                                    InputProps={{
                                        endAdornment: <IconButton onClick={()=>removeItem("authors",index)} children={<CloseIcon />} aria-label="delete" />
                                    }}
                                    required
                                />
                            )
                        })}
                    </div>
                    <div className='flex flex-row mt-2'>
                        <Button variant="outlined" onClick={()=>addItem("citations")}>Add Citation +</Button>
                    </div>
                    <div className='flex flex-wrap mt-2'>
                        {document.citations.map((cit, index)=>{
                            return(
                                <TextField
                                    key={`cit${index}`}
                                    sx={{m: 1, flex: "1 0 21%"}}
                                    id="outlined-helperText"
                                    label={`Citation ${index+1}`}
                                    onChange={handleArrayChange(index, "citations")}
                                    value={document.citations[index]}
                                    InputProps={{
                                        endAdornment: <IconButton onClick={()=>removeItem("citations",index)} children={<CloseIcon />} aria-label="delete" />
                                    }}
                                />
                            )
                        })}
                    </div>
                    <div className='flex flex-row mt-2'>
                        <Button variant="outlined" onClick={()=>addItem("keywords")}>Add Keyword +</Button>
                    </div>
                    <div className='flex flex-wrap mt-2'>
                        {document.keywords.map((key, index)=>{
                            return(
                                <TextField
                                    key={`keyword${index}`}
                                    sx={{m: 1, flex: "1 0 21%"}}
                                    id="outlined-helperText"
                                    label={`Keyword ${index+1}`}
                                    onChange={handleArrayChange(index, "keywords")}
                                    value={document.keywords[index]}
                                    InputProps={{
                                        endAdornment: <IconButton onClick={()=>removeItem("keywords",index)} children={<CloseIcon />} aria-label="delete" />
                                    }}
                                    required
                                />
                            )
                        })}
                    </div>
                    <div className='flex flex-row mt-2'>
                        <Button variant="outlined" onClick={()=>addItem("languages")}>Add Language +</Button>
                    </div>
                    <div className='flex flex-wrap mt-2'>
                        {document.languages.map((key, index)=>{
                            return(
                                <TextField
                                    key={`languages${index}`}
                                    sx={{m: 1, flex: "1 0 21%"}}
                                    id="outlined-helperText"
                                    label={`Language ${index+1}`}
                                    onChange={handleArrayChange(index,"languages")}
                                    value={document.languages[index]}
                                    InputProps={{
                                        endAdornment: <IconButton onClick={()=>removeItem("languages",index)} children={<CloseIcon />} aria-label="delete" />
                                    }}
                                    required
                                />
                            )
                        })}
                    </div>
                    <div className='flex flex-row mt-2'>
                        <Button variant="outlined" onClick={()=>addItem("advisers")}>Add Adviser +</Button>
                    </div>
                    <div className='flex flex-wrap mt-2'>
                        {document.advisers.map((key, index)=>{
                            return(
                                <TextField
                                    key={`adivser${index}`}
                                    sx={{m: 1, flex: "1 0 21%"}}
                                    id="outlined-helperText"
                                    label={`Adviser ${index+1}`}
                                    onChange={handleArrayChange(index, "advisers")}
                                    value={document.advisers[index]}
                                    InputProps={{
                                        endAdornment: <IconButton onClick={()=>removeItem("advisers",index)} children={<CloseIcon />} aria-label="delete" />
                                    }}
                                    required
                                />
                            )
                        })}
                    </div>
                    <div className='flex flex-row mt-2'>
                        <Button variant="outlined" onClick={()=>addItem("formats")}>Add Format +</Button>
                    </div>
                    <div className='flex flex-wrap mt-2'>
                        {document.formats.map((key, index)=>{
                            return(
                                <TextField
                                    key={`format${index}`}
                                    sx={{m: 1, flex: "1 0 21%"}}
                                    id="outlined-helperText"
                                    label={`Format ${index+1}`}
                                    onChange={handleArrayChange(index, "formats")}
                                    value={document.formats[index]}
                                    InputProps={{
                                        endAdornment: <IconButton onClick={()=>removeItem("formats",index)} children={<CloseIcon />} aria-label="delete" />
                                    }}
                                    required
                                />
                            )
                        })}
                    </div>
                    <div className='flex flex-row mt-2'>
                        <Button variant="outlined" onClick={()=>addItem("physicalDescription")}>Add Physical Description +</Button>
                    </div>
                    <div className='flex flex-wrap mt-2'>
                        {document.physicalDescription.map((key, index)=>{
                            return(
                                <TextField
                                    key={`physicalDescription${index}`}
                                    sx={{m: 1, flex: "1 0 21%"}}
                                    id="outlined-helperText"
                                    label={`Physical Description ${index+1}`}
                                    onChange={handleArrayChange(index, "physicalDescription")}
                                    value={document.physicalDescription[index]}
                                    InputProps={{
                                        endAdornment: <IconButton onClick={()=>removeItem("physicalDescription",index)} children={<CloseIcon />} aria-label="delete" />
                                    }}
                                    required
                                />
                            )
                        })}
                    </div>
                </Box>
            </DialogContent>
        </DraggableDialog>
    );
}

export default CreateDocument;
