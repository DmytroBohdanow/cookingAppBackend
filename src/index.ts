import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose, { Document, Schema } from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recipes').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

// Define Recipe Interface and Schema
interface IRecipe extends Document {
    id: number;
    name: string;
    type: string;
    calories: number;
    ingredients: string[];
    day: string;
}

const recipeSchema = new Schema<IRecipe>({
    id: Number,
    name: String,
    type: String,
    calories: Number,
    ingredients: [String],
    day: String
});

const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);

// Middleware
app.use(bodyParser.json());

// API endpoints
app.get('/api/selectAll', async (req: Request, res: Response) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/deleteById', async (req: Request, res: Response) => {
    const id = req.query.id as string;
    try {
        await Recipe.findByIdAndDelete(id);
        res.json({ message: "Recipe deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/updateById', async (req: Request, res: Response) => {
    const id = req.body.id as string;
    const updatedRecipe = req.body.recipe as Partial<IRecipe>;
    try {
        await Recipe.findByIdAndUpdate(id, updatedRecipe);
        res.json({ message: "Recipe updated successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/create', async (req: Request, res: Response) => {
    const { id, name, type, calories, ingredients, day } = req.body;
    try {
        const newRecipe = new Recipe({ id, name, type, calories, ingredients, day });
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
