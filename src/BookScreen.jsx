import { useState, useEffect } from 'react';
import { Divider, Spin, Input, Select } from 'antd';
import BookList from './components/BookList'
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import axios from 'axios';
import { Modal } from 'antd';
import { askGeminiAboutBook } from './services/gemini';

const URL_BOOK = "/api/book"

const URL_CATEGORY = "/api/book-category"

function BookScreen() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false)
  const [bookData, setBookData] = useState([])
  const [categories, setCategories] = useState([])
  const [editItem, setEditItem] = useState(null)
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(URL_CATEGORY)
      setCategories(response.data.map(cat => ({
        label: cat.name,
        value: cat.id
      })))
    } catch(err) {console.log(err)}
  }

  const fetchBooks = async () => {
    setLoading(true)
    try{
      const response = await axios.get(URL_BOOK)
      setBookData(response.data)
    } catch(err) { console.log(err) }
    finally { setLoading(false)}
  }

  const handleAddBook = async (book) => {
    setLoading(true)
    try{
      await axios.post(URL_BOOK, book)
      fetchBooks()
    } catch(err) { console.log(err)}
    finally {setLoading(false)}
  }

  const handleLikeBook = async (book) => {
    try {
      await axios.post(`/api/book/${book.id}/like`)
      setBookData(bookData.map(b => b.id === book.id ? { ...b, likeCount: b.likeCount + 1 } : b))
    } catch(err) { console.log(err) }
  }

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`/api/book/${bookId}`)
      setBookData(bookData.filter(book => book.id !== bookId))
    } catch(err) { console.log(err) }
  }

  const handleUpdateBook = async (values) => {
    try {
      setLoading(true)
      await axios.patch(`/api/book/${editItem.id}`, values)
      fetchBooks()
      setEditItem(null)
    } catch(err) { console.log(err) }
    finally { setLoading(false) }
  }

  const handleAskAI = async (book) => {
    setIsAiModalOpen(true);
    setAiLoading(true);
    setAiResponse("Asking Gemini...");
    
    const result = await askGeminiAboutBook(book.title, book.author);
    setAiResponse(result);
    setAiLoading(false);
  }

  useEffect(() => {
    setTotalAmount(bookData.reduce((total, book) => total + (book.price * book.stock), 0))
  }, [bookData])

  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [])
  
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredBooks = bookData.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchText.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filterCategory === 'All' || book.category.id === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2em", alignItems: "center" }}>
        <AddBook onBookAdded={handleAddBook} categories={categories}/>
        
        <div style={{ display: 'flex', gap: '10px' }}>
             <Input.Search 
                placeholder="Search by Title or Author" 
                allowClear 
                onSearch={value => setSearchText(value)}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 250 }} 
             />
             <Select
                defaultValue="All"
                style={{ width: 150 }}
                onChange={value => setFilterCategory(value)}
                options={[
                    { value: 'All', label: 'All Categories' },
                    ...categories
                ]}
             />
        </div>
      </div>

      <Divider>
        My books worth {totalAmount.toLocaleString()} dollars
      </Divider>
      <Spin spinning={loading}>
        <BookList 
          data={filteredBooks} 
          onLiked={handleLikeBook}
          onDeleted={handleDeleteBook}
          onEdit={setEditItem}
          onAskAI={handleAskAI}
        />
      </Spin>

      <EditBook 
        isOpen={editItem !== null} 
        item={editItem} 
        onCancel={() => setEditItem(null)} 
        onSave={handleUpdateBook} 
        categories={categories}
      />

       <Modal
        title="Gemini AI Book Info"
        open={isAiModalOpen}
        onOk={() => setIsAiModalOpen(false)}
        onCancel={() => setIsAiModalOpen(false)}
      >
        <p>{aiLoading ? "Loading..." : aiResponse}</p>
      </Modal>
    </>
  )
}

export default BookScreen
