import Axios from "axios";

const submit =() => {

}
function Post() {
    return (
        <div>
            <h2>New post!</h2>
            <form>
                <label for="postTitle">Make a title!</label><br/>
                <input type="text" id="postTitle"/><br/>
                <br/>
                <label for="postText" placeholder="Type anything here! (within reason lol)">Post something here!</label><br/>
                <textarea id="postText" placeholder="Type anything here! (within reason lol)" cols="40" rows="10"></textarea>
                <br/>
                {/*<ReCAPTCHA
          sitekey="6LelxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          onChange={verify()}
        />*/}
                <br/>
                <button type="submit" id="postSubmit" onClick={submit}>Submit</button>
            </form>
        </div>
    );
}

export default Post;