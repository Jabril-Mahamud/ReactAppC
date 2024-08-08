import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaylistCard from '../components/Playlist/PlaylistCard';
import PlaylistDialog from '../components/Playlist/PlaylistDialog';
import PlaylistTable from '../components/Playlist/PlaylistTable';
import { getAppFromUrl, sortPlaylists } from '../services/utils';
import { fetchAllPlaylists, fetchIdPlaylists, deletePlaylist, createPlaylist, fetchUserId } from '../services/playlistService';
import { useAuth } from '../components/Auth/AuthContext';

interface Playlist {
    id: number;
    content: string;
    sauce: string;
    app: string;
    date: string;
    time: string;
}

const WatchLater: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<Playlist>>({});
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('dateDesc');
    const [viewOption, setViewOption] = useState<'playlist' | 'views'>('playlist');

    useEffect(() => {
        const loadPlaylists = async () => {
            try {
                if (isLoggedIn) {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        logout();
                        return;
                    }
                    const user = await fetchUserId(token);
                    if (user.id) {
                        const userPlaylists = await fetchIdPlaylists(user.id);
                        setPlaylists(sortPlaylists(userPlaylists, sortOption));
                    }
                } else {
                    const allPlaylists = await fetchAllPlaylists();
                    setPlaylists(sortPlaylists(allPlaylists, sortOption));
                }
            } catch (error) {
                console.error('Fetching error:', error);
            }
        };

        loadPlaylists();
    }, [isLoggedIn, logout, sortOption, viewOption]);

    const handleDialogClose = () => {
        setDialogOpen(false);
        setFormData({});
    };

    const handleCreate = () => {
        setFormData({});
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await deletePlaylist(id);
            showSnackbar('Playlist deleted successfully');
        } catch (error) {
            console.error('Delete error:', error);
            showSnackbar('Error deleting playlist');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const app = getAppFromUrl(formData.sauce || '');
            const newPlaylist = { ...formData, app };
            await createPlaylist(newPlaylist);
            handleDialogClose();
            showSnackbar('Playlist created successfully');
        } catch (error) {
            console.error('Create error:', error);
            showSnackbar('Error creating playlist');
        }
    };

    const handleFormDataChange = (field: keyof Playlist, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {viewOption === 'playlist' ? 'Playlists' : 'Video Feed'}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, width: '100%' }}>
                    <Stack spacing={2} sx={{ marginRight: 2 }}>
                        <Button
                            variant="contained"
                            color={viewOption === 'playlist' ? 'primary' : 'default'}
                            onClick={() => setViewOption(viewOption === 'playlist' ? 'views' : 'playlist')}
                            sx={{
                                backgroundColor: viewOption === 'playlist' ? 'primary.main' : 'grey.300',
                                '&:hover': {
                                    backgroundColor: viewOption === 'playlist' ? 'primary.dark' : 'grey.400',
                                },
                            }}
                        >
                            {viewOption === 'playlist' ? 'Switch to Views' : 'Switch to Playlists'}
                        </Button>

                        {viewOption === 'playlist' && isLoggedIn && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleCreate}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                }}
                            >
                                Create Playlist
                            </Button>
                        )}
                    </Stack>

                    {viewOption === 'playlist' && isLoggedIn && (
                        <FormControl sx={{ minWidth: 180, marginLeft: 'auto' }}>
                            <InputLabel id="sort-select-label" sx={{ color: 'grey.600' }}>
                                Sort by
                            </InputLabel>
                            <Select
                                labelId="sort-select-label"
                                value={sortOption}
                                label="Sort by"
                                onChange={(e) => setSortOption(e.target.value)}
                                sx={{
                                    '& .MuiSelect-select': {
                                        padding: '10px 14px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'grey.400',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'grey.600',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'primary.main',
                                    },
                                }}
                            >
                                <MenuItem value="dateDesc">Newest First</MenuItem>
                                <MenuItem value="dateAsc">Oldest First</MenuItem>
                                <MenuItem value="contentAsc">Content (A-Z)</MenuItem>
                                <MenuItem value="contentDesc">Content (Z-A)</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </Box>

                {viewOption === 'playlist' ? (
                    isLoggedIn ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, width: '100%' }}>
                            {playlists.map((playlist) => (
                                <PlaylistCard
                                    key={playlist.id}
                                    playlist={playlist}
                                    onDelete={handleDelete}
                                    aspectRatio={16 / 9}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ width: '100%' }}>
                            <PlaylistTable playlists={playlists} handleDelete={handleDelete} />
                        </Box>
                    )
                ) : (
                    <Box sx={{ width: '100%' }}>
                        <PlaylistTable playlists={playlists} handleDelete={handleDelete} />
                    </Box>
                )}

                <PlaylistDialog
                    open={dialogOpen}
                    formData={formData}
                    onClose={handleDialogClose}
                    onChange={handleFormDataChange}
                    onSubmit={handleSubmit}
                />

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                    message={snackbarMessage}
                />
            </Box>
        </Box>
    );
};

export default WatchLater;