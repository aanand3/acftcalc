import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

// style for the slider
const useStyles = makeStyles({
    root: {
        width: 500,
        color: "white",

    },
    input: {
        width: 42,
        color: 'white',
    },
});

export default function TimeSlider(props)
{
    const classes = useStyles();
    // value starts at the min
    const [value, setValue] = React.useState(props.min);
    const [score, setScore] = React.useState(0);
    const [minuteValue, setMinuteValue] = React.useState(props.minuteMin)
    const [secondValue, setSecondValue] = React.useState(props.secondMin)

    // same as component did mount for obj compo's 
    useEffect(() =>
    {
        setMinutesAndSeconds();
        grabScoreFromFile();
    });

    // for the slider
    const handleTimeSliderChange = async (event, newValue) =>
    {
        setValue(newValue);
        // setMinutesAndSeconds();
    };

    const setMinutesAndSeconds = () =>
    {
        var minutes = Math.floor(value / 60);
        var seconds = value - minutes * 60;
        setMinuteValue(minutes)
        setSecondValue(seconds)
    };

    // const convertToTime = (rawValue) =>
    // {
    //     var seconds = rawValue%60;
    //     rawValue /= 60;
    //     setValue(rawValue + seconds)
    // };

    // for the text field
    const handleMinuteChange = async (event) =>
    {
        setMinuteValue(event.target.value === '' ? '' : Number(event.target.value));
        setValue(minuteValue * 60 + secondValue);
    };

    const handleSecondChange = async (event) =>
    {
        setSecondValue(event.target.value === '' ? '' : Number(event.target.value));
        setValue(minuteValue * 60 + secondValue)
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
        console.log(lines);

        var score = findScore(lines);
        console.log('score is ', score)
        setScore(score);
        //return score;
    }

    function findScore(lines)
    {
        if (value <= props.min)
        {
            return 0;
        } else if (value >= props.max)
        {
            return 100;
        }

        for (let i = 0; i < lines.length - 1; i++)
        {
            if (value >= Number(lines[i].split(' ')[0]) && value < Number(lines[i + 1].split(' ')[0]))
            {
                return lines[i].split(' ')[1];
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
        <div className={classes.root}>
            <Typography id="input-slider" gutterBottom>
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
                <Grid item>
                    <Input
                        className={classes.input}
                        value={minuteValue}
                        margin="dense"
                        onChange={handleMinuteChange}

                        inputProps={{
                            step: props.step,
                            min: '0',
                            max: '4',
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                    <Input
                        className={classes.input}
                        value={secondValue}
                        margin="dense"
                        onChange={handleSecondChange}

                        inputProps={{
                            step: props.step,
                            min: '00',
                            max: '59',
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />                
                </Grid>
                <Grid item>
                    <Typography> {score} </Typography>
                </Grid>
            </Grid>
        </div>
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

