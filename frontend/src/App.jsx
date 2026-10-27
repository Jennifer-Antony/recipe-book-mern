
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus, Search, ChefHat, Clock, Pencil, Trash2,
  X, ArrowLeft, UtensilsCrossed, BookOpen, Leaf
} from "lucide-react";
import "./index.css";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/recipes`;

const emptyForm = {
  name: "",
  category: "Breakfast",
  ingredients: "",
  steps: "",
  cookingTime: "",
};

const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Other"];

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function fetchRecipes() {
    try {
      setLoading(true);
      const response = await axios.get(API);
      setRecipes(response.data);
    } catch {
      setNotice("Could not load recipes. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  function openNewForm() {
    setForm(emptyForm);
    setEditingId(null);
    setSelected(null);
    setShowForm(true);
    setNotice("");
  }

  function openEditForm(recipe) {
    setForm({
      name: recipe.name,
      category: recipe.category,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cookingTime: String(recipe.cookingTime),
    });
    setEditingId(recipe._id);
    setSelected(null);
    setShowForm(true);
    setNotice("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice("");

    const payload = {
      ...form,
      name: form.name.trim(),
      ingredients: form.ingredients.trim(),
      steps: form.steps.trim(),
      cookingTime: Number(form.cookingTime),
    };

    if (!payload.name || !payload.ingredients || !payload.steps) {
      setNotice("Please fill in every field.");
      return;
    }

    if (!Number.isInteger(payload.cookingTime) || payload.cookingTime < 1) {
      setNotice("Cooking time must be a whole number of at least 1 minute.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
        setNotice("Recipe updated successfully!");
      } else {
        await axios.post(API, payload);
        setNotice("Recipe added successfully!");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await fetchRecipes();
    } catch (error) {
      setNotice(error.response?.data?.message || "Could not save the recipe.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(recipe) {
    if (!window.confirm(`Delete "${recipe.name}"? This cannot be undone.`)) return;

    try {
      await axios.delete(`${API}/${recipe._id}`);
      setRecipes((current) => current.filter((item) => item._id !== recipe._id));
      setSelected(null);
      setNotice("Recipe deleted successfully!");
    } catch {
      setNotice("Could not delete the recipe.");
    }
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || recipe.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => {
          setSelected(null);
          setShowForm(false);
        }}>
          <span className="brand-icon"><ChefHat size={25} /></span>
          <span>the recipe <strong>book.</strong></span>
        </a>
        <div className="topbar-right">
          <span className="saved-count"><BookOpen size={16} /> {recipes.length} recipes saved</span>
          <button className="primary-button" onClick={openNewForm}>
            <Plus size={18} /> Add recipe
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><Leaf size={15} /> YOUR PERSONAL COLLECTION</span>
            <h1>Good food.<br /><span>Good memories.</span></h1>
            <p>All your favourite recipes, in one lovely little place.</p>
            <button className="primary-button hero-button" onClick={openNewForm}>
              <Plus size={18} /> Add your first recipe
            </button>
          </div>
          <div className="hero-art">
            <div className="hero-circle">
              <span className="hero-emoji">🥗</span>
              <span className="floating-emoji emoji-one">🍅</span>
              <span className="floating-emoji emoji-two">🥑</span>
              <span className="floating-emoji emoji-three">🌿</span>
            </div>
            <div className="hero-note">made with love <span>♡</span></div>
          </div>
        </section>

        {notice && (
          <div className="notice" role="status">
            <span>{notice}</span>
            <button aria-label="Dismiss message" onClick={() => setNotice("")}><X size={16} /></button>
          </div>
        )}

        {selected ? (
          <section className="detail-panel">
            <button className="back-button" onClick={() => setSelected(null)}>
              <ArrowLeft size={17} /> Back to recipes
            </button>
            <div className="detail-card">
              <div className="detail-heading">
                <span className="category-pill">{selected.category}</span>
                <h2>{selected.name}</h2>
                <span className="time-label"><Clock size={17} /> {selected.cookingTime} minutes</span>
              </div>
              <div className="detail-columns">
                <div>
                  <h3><UtensilsCrossed size={19} /> Ingredients</h3>
                  <p className="preserve-lines">{selected.ingredients}</p>
                </div>
                <div>
                  <h3><ChefHat size={19} /> Preparation steps</h3>
                  <p className="preserve-lines">{selected.steps}</p>
                </div>
              </div>
              <div className="detail-actions">
                <button className="secondary-button" onClick={() => openEditForm(selected)}><Pencil size={16} /> Edit recipe</button>
                <button className="danger-button" onClick={() => handleDelete(selected)}><Trash2 size={16} /> Delete recipe</button>
              </div>
            </div>
          </section>
        ) : showForm ? (
          <section className="form-section">
            <button className="back-button" onClick={() => setShowForm(false)}><ArrowLeft size={17} /> Back to recipes</button>
            <div className="form-card">
              <span className="eyebrow">YOUR KITCHEN, YOUR RULES</span>
              <h2>{editingId ? "Edit your recipe" : "Add a new recipe"}</h2>
              <p className="form-intro">Keep the delicious details safe for next time.</p>
              <form onSubmit={handleSubmit}>
                <label>Recipe name
                  <input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Creamy tomato pasta" />
                </label>
                <div className="form-grid">
                  <label>Category
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {categories.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label>Cooking time (minutes)
                    <input required type="number" min="1" step="1" value={form.cookingTime} onChange={(e) => setForm({ ...form, cookingTime: e.target.value })} placeholder="e.g. 30" />
                  </label>
                </div>
                <label>Ingredients
                  <textarea required rows="4" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} placeholder={"One ingredient per line\n2 tomatoes\n1 onion\n1 tbsp olive oil"} />
                </label>
                <label>Preparation steps
                  <textarea required rows="5" value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} placeholder={"Write the steps in order...\n1. Chop the vegetables\n2. Heat the pan"} />
                </label>
                <div className="form-actions">
                  <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="primary-button" disabled={saving}>
                    {saving ? "Saving..." : editingId ? "Save changes" : "Save recipe"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : (
          <section className="recipes-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">FROM YOUR KITCHEN</span>
                <h2>Your recipe collection <span>✳</span></h2>
                <p>A little inspiration for whatever you're craving.</p>
              </div>
              <span className="collection-count">{filteredRecipes.length} found</span>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <Search size={18} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recipes or ingredients..." />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
                <option>All</option>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="empty-state"><span className="loading-spinner" /> Loading your recipes...</div>
            ) : filteredRecipes.length === 0 ? (
              <div className="empty-state">
                <span className="empty-illustration">🍲</span>
                <h3>{search || category !== "All" ? "No recipes found" : "Your collection starts here"}</h3>
                <p>{search || category !== "All" ? "Try a different search or category." : "Add a favourite recipe and it'll be waiting for you here."}</p>
                {!search && category === "All" && <button className="primary-button" onClick={openNewForm}><Plus size={18} /> Add a recipe</button>}
              </div>
            ) : (
              <div className="recipe-grid">
                {filteredRecipes.map((recipe, index) => (
                  <article className="recipe-card" key={recipe._id}>
                    <div className={`recipe-art art-${index % 4}`}>
                      <span className="food-emoji">{["🥘", "🍝", "🥗", "🍰"][index % 4]}</span>
                      <span className="category-pill">{recipe.category}</span>
                    </div>
                    <div className="recipe-content">
                      <h3>{recipe.name}</h3>
                      <p className="ingredient-preview">{recipe.ingredients}</p>
                      <div className="recipe-card-bottom">
                        <span className="time-label"><Clock size={15} /> {recipe.cookingTime} min</span>
                        <div className="card-actions">
                          <button className="icon-button" aria-label={`Edit ${recipe.name}`} onClick={() => openEditForm(recipe)}><Pencil size={16} /></button>
                          <button className="icon-button delete-icon" aria-label={`Delete ${recipe.name}`} onClick={() => handleDelete(recipe)}><Trash2 size={16} /></button>
                          <button className="view-button" onClick={() => setSelected(recipe)}>View <span>→</span></button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer><span>the recipe book.</span> <span>Made for the love of good food <span className="footer-heart">♥</span></span></footer>
    </div>
  );
}
