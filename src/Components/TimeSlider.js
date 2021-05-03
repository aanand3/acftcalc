import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Box, Paper } from '@material-ui/core';


// style for the slider
const useStyles = makeStyles((theme) =>({
    root: {
        color: "white",

    },
    input: {
        width: 42,
        color: 'white',
    },
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
          margin: theme.spacing(1),
          width: theme.spacing(4),
          height: theme.spacing(2),
        },
        background: '#936e11ec',
        color: "white",
      },
}));

export default function TimeSlider(props)
{
    const classes = useStyles();
    // value starts at the min
    const [value, setValue] = React.useState(props.min);
    const [score, setScore] = React.useState(0);

    // same as component did mount for obj compo's 
    useEffect(() =>
    {
        grabScoreFromFile();
    });

    // for the slider
    const handleTimeSliderChange = async (event, newValue) =>
    {
        setValue(newValue);
    };

    var minutes = Math.floor(value / 60);
    var seconds = (value - minutes * 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      });

    // for the text field
    const handleMinuteChange = async (event) =>
    {
        let newMinutes = 0;
        newMinutes = parseInt(event.target.value)
        console.log(newMinutes, seconds)

        let newTotal = newMinutes * 60 + seconds

        if(newTotal >= 0){
            setValue(newTotal)
        } else {setValue(seconds)}

    };

    const handleSecondChange = async (event) =>
    {
        let newSeconds = 0;
        newSeconds = parseInt(event.target.value)

        seconds = parseInt(event.target.value)
        console.log(minutes, newSeconds)

        let newTotal = minutes * 60 + newSeconds;

        if (newTotal >= 0)
        {
            setValue(newTotal)
        } else { setValue(minutes * 60) }
    };
    // handleBlur called when component goes out of focus
    // const handleBlur = async() =>
    // {
    //     if (value < props.min)
    //     {
    //         setValue(props.min);
    //     } else if (value > props.max)
    //     {
    //         setValue(props.max);
    //     }
    // };

    const grabScoreFromFile = async () =>
    {
        // might fail, but if doesnt replace w fileName
        const fileContent = await fetch(props.fileName);
        const text = await fileContent.text();
        console.log('value is ', value)
        var lines = text.split("\n");
        console.log(lines)

        var score = findScore(lines);
        console.log('score is ', score)
        setScore(score);
        //return score;
    }

    function findScore(lines)
    {
        if (value <= props.min)
        {
            return 100;
        } else if (value >= props.max)
        {
            return 0;
        }

        // needs to go from (lowerNum, higherNum] and then return the score of the higher
        for (let i = 0; i < lines.length - 1; i++)
        {
            console.log('comparing: ', value, Number(lines[i].split(' ')[0]), Number(lines[i + 1].split(' ')[0]))
            if (value > Number(lines[i].split(' ')[0]) 
                && value <= Number(lines[i + 1].split(' ')[0]))
            {
                return lines[i+1].split(' ')[1];
            }
        }
    }

    function generateMarks()
    {
        let output = []
        for (let i = props.min; i < props.max; i += props.step)
        {
            output.push({ value: i })
        }
        return output;
    }

    return (
        <Box className={classes.root} width = "50%">
            <Typography variant="h4" id="input-slider" gutterBottom>
                {props.eventName}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <ACFTSlider
                        value={value}
                        onChange={handleTimeSliderChange}
                        aria-labelledby="input-slider"
                        defaultValue={props.min}
                        valueLabelDisplay="auto"
                        step={props.step}
                        marks={generateMarks()}
                        min={props.min}
                        max={props.max} />
                </Grid>
                <Grid item xs={2}>
                    <Input
                        className={classes.input}
                        value={minutes.toString()}
                        margin="dense"
                        onChange={handleMinuteChange}

                        inputProps={{
                            step: props.step,
                            min: 0,
                            max: 4,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    /> 
                    <Input
                        className={classes.input}
                        value={seconds.toString()}
                        margin="dense"
                        onChange={handleSecondChange}

                        inputProps={{
                            step: props.step,
                            min: 0,
                            max: 59,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
                <Paper className={classes.paper} item xs={1}>
                    <Typography> {score} </Typography>
                </Paper>
            </Grid>
        </Box>
    );
}

TimeSlider.propTypes = {
    eventName: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    fileName: PropTypes.string,
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

