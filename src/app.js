require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const clothingRoutes = require('./routes/clothing.routes');
const ethnicGroupRoutes = require('./routes/ethnicGroups.routes');
const tagRoutes = require('./routes/tags.routes');
const reservationRoutes = require('./routes/reservations.routes');
const orderRoutes = require('./routes/orders.routes');
const commentRoutes = require('./routes/comments.routes');
const mediaRoutes = require('./routes/media.routes');
const pageRoutes = require('./routes/pages.routes');
const settingRoutes = require('./routes/settings.routes');
const themeRoutes = require('./routes/theme.routes');
const requestRoutes = require('./routes/requests.routes');
const communityRoutes = require('./routes/community.routes');
const userRoutes = require('./routes/users.routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/clothing', clothingRoutes);
app.use('/api/ethnic-groups', ethnicGroupRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: require('../version.json').version });
});

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);

app.listen(PORT, () => console.log(`Barna Backend running on port ${PORT}`));

module.exports = app;
