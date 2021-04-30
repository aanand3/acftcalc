import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import scoreFile from '../Reference/MDLData.csv';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    root: {
        width: 500,
        color: "white",
        
    },
    input: {
        width: 42,
        color: 'white',
    },

    palette: {
        type: 'dark',
    },
});



export default function MDLInput()
{
    const classes = useStyles();
    const [value, setValue] = React.useState(130);
    const [score, setScore] = React.useState(0);

    const handleSliderChange = (event, newValue) =>
    {
        setValue(newValue);
        grabScoreFromFile();
    };

    const handleInputChange = (event) =>
    {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
        grabScoreFromFile();
    };

    const handleBlur = () =>
    {
        if (value < 130)
        {
            setValue(130);
        } else if (value > 340)
        {
            setValue(340);
        }
    };

    const grabScoreFromFile = async () =>
    {
        const fileContent = await fetch(scoreFile);
        const text = await fileContent.text();

        var score = text.match(new RegExp(value + '\\s(\\w+)'))[1];
        setScore(score);
        //return score;
    }

    return (
        <div className={classes.root}>
            <Typography id="input-slider" gutterBottom>
                Deadlift Score
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <ACFTSlider
                        value={typeof value === 'number' ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        defaultValue={130}
                        valueLabelDisplay="auto"
                        step={10}
                        marks={generateMarks()}
                        min={130}
                        max={340} />
                </Grid>
                <Grid item>
                    <Input
                        className={classes.input}
                        value={value}
                        margin="dense"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: 130,
                            max: 340,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
                <Grid item>
                    <Typography>{score}</Typography>
                </Grid>
                <Button onClick={() => grabScoreFromFile(value)}>Show file content</Button>
            </Grid>
        </div>
    );
}


var ACFTSlider = withStyles({
    root: {
        color: 'black',
    },
    thumb: {
        height: 16,
        width: 16,
        backgroundColor: '#936e11ec',
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50%)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
    mark: {
        backgroundColor: '#936e11ec',
        height: 2,
        width: 1,
    },
})(Slider);

function generateMarks()
{
    let output = []
    for (let i = 140; i < 340; i += 10)
    {
        output.push({ value: i })
    }
    return output;
}

function findScore(raw) 
{

}