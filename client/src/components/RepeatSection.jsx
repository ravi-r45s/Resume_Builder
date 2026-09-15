export default function RepeatSection({ title, items, fields, onChange, makeBlank, addLabel }) {
  function updateItem(id, key, value) {
    onChange(items.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  }

  function addItem() {
    onChange([...items, makeBlank()]);
  }

  function removeItem(id) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <section className="form-section">
      <div className="form-section-head">
        <h2>{title}</h2>
        <button type="button" className="add-link" onClick={addItem}>
          + {addLabel}
        </button>
      </div>

      {items.length === 0 && <p className="muted" style={{ fontSize: 13.5 }}>Nothing added yet.</p>}

      {items.map((item) => (
        <div className="repeat-card" key={item.id}>
          <button type="button" className="remove-btn" onClick={() => removeItem(item.id)} aria-label="Remove entry">
            ×
          </button>
          <div className="form-grid-2">
            {fields
              .filter((f) => f.type !== 'textarea')
              .map((f) => (
                <label key={f.key}>
                  {f.label}
                  <input
                    value={item[f.key] || ''}
                    placeholder={f.placeholder}
                    onChange={(e) => updateItem(item.id, f.key, e.target.value)}
                  />
                </label>
              ))}
          </div>
          {fields
            .filter((f) => f.type === 'textarea')
            .map((f) => (
              <label key={f.key}>
                {f.label}
                <textarea
                  rows={3}
                  value={item[f.key] || ''}
                  placeholder={f.placeholder}
                  onChange={(e) => updateItem(item.id, f.key, e.target.value)}
                />
              </label>
            ))}
        </div>
      ))}
    </section>
  );
}
