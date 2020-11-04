import React from 'react';
import './FaceRecognition.css'

const FaceRecognition =({imageUrl, box}) =>{
    const styles = {top: box.topRow, right: box.rightCol, left: box.leftCol, bottom: box.bottomRow};
    return(
        <div className ='center ma '>
            <div className ='absolute mt2'>
                <img id='inputimage' alt='face' src ={imageUrl} width ='500px' height ='auto'/>
                <div className='bounding-box' style ={styles}></div>
            </div>
        </div>
    );
};


export default FaceRecognition