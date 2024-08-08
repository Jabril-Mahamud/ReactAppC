import React from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, Box, Avatar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Delete as DeleteIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import ReactPlayer from 'react-player';

interface Playlist {
    id: number;
    content: string;
    sauce: string;
    app: string;
    date: string;
    time: string;
}

interface PlaylistCardProps {
    playlist: Playlist;
    onDelete: (id: number) => void;
    aspectRatio?: number;
    sortOption: string;
    handleSortOptionChange: (option: string) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onDelete, aspectRatio = 4 / 3, sortOption, handleSortOptionChange }) => {
    const paddingTop = `${(1 / aspectRatio) * 100}%`;

    return (
        <Box sx={{
            width: '75%',
            maxWidth: '75%',
            margin: '0 auto',
        }}>
            <Card sx={{
                boxShadow: 1,
                width: '100%',
                paddingTop: paddingTop,
                position: 'relative',
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <CardContent sx={{ flexShrink: 0, paddingTop: 1, paddingBottom: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                            <Avatar sx={{ marginRight: 2 }}>
                                {playlist.app[0].toUpperCase()}
                            </Avatar>
                            <Typography variant="subtitle1" component="span" sx={{ flexGrow: 1 }}>
                                {playlist.app}
                            </Typography>
                            <IconButton size="small">
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                    </CardContent>
                    <CardMedia sx={{ flex: 1, minHeight: 0 }}>
                        <ReactPlayer
                            url={playlist.sauce}
                            width="100%"
                            height="100%"
                            controls
                        />
                    </CardMedia>
                    <CardContent sx={{ flexShrink: 0, paddingTop: 1, paddingBottom: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="body2" component="p" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                {playlist.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" component="p">
                                {playlist.date} at {playlist.time}
                            </Typography>
                        </Box>
                        <Box>
                            <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
                                <InputLabel id="sort-select-label">Sort by</InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    value={sortOption}
                                    label="Sort by"
                                    onChange={(e) => handleSortOptionChange(e.target.value)}
                                >
                                    <MenuItem value="dateDesc">Newest First</MenuItem>
                                    <MenuItem value="dateAsc">Oldest First</MenuItem>
                                    <MenuItem value="contentAsc">Content (A-Z)</MenuItem>
                                    <MenuItem value="contentDesc">Content (Z-A)</MenuItem>
                                </Select>
                            </FormControl>
                            <IconButton size="small" onClick={() => onDelete(playlist.id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Box>
            </Card>
        </Box>
    );
};

export default PlaylistCard;