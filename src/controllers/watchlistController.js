import { watch } from "node:fs"
import { prisma } from "../config/db.js"
import { useState } from "react"

const addToWatchlist = async (req, res) => {
    const {movieId, status, rating, notes} = req.body

    // Verify Movie Exisits
    const movie = await prisma.movie.findUnique({
        where: {id: movieId}
    })
    if(!movie){
        res.status(404).json({error: "Movie not found"})
    }

    // Check if already in the Watchlist
    const inWatchlist = await prisma.watchlist.findUnique({ 
        where: { 
            userId_movieId: { 
                userId: req.user.id,
                movieId: movieId 
            } }
        })

    if (inWatchlist){
        res.status(400).json({error: "Movie already in the watchlist"})
    }

    // Create Watchlist item
    const watchlistItem = await prisma.watchlist.create({
        data: {
            userId: req.user.id,
            movieId,
            status: status || "PLANNED",
            rating,
            notes
        }
    })

    res.status(201).json({
        status: "success",
        data: {
            watchlistItem
        }
    })
}

const removeFromWatchlist = async (req, res) => {
  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlist.findUnique({
    where: { id: req.params.id }
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  // Ensure only owner can delete
  if (watchlistItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to delete this watchlist item" });
  }

  await prisma.watchlist.delete({
    where: { id: req.params.id }
  });

  res.status(200).json({
    status: "success",
    message: "Movie removed from watchlist",
  });
};

const updateWatchlistItem = async (req,res,next) =>{
    const {status, rating, notes} = req.body
    
    const watchListItem = await prisma.watchlist.findUnique({
        where: {id: req.params.id}
    })
    // Check to make sure movie is in the watchlist
    if(!watchListItem){
        return res.status(404).json({error: "Movie is not in watch list"})
    }

    // Ensure only the owner can update
    if(watchListItem.userId !== req.user.id){
        return res.status(403).json({
            error: "Not allowed to update this watchlist item."
        })
    }

    // Update the movie in the watch list.
    const updateMovie = await prisma.watchlist.update({
        where: {id: req.params.id},
        data: {
            status: status,
            notes: notes,
            rating: rating
        } 
    })

    if(!updateMovie){
        return res.status(403).json({
            error: "Error updating movie"
        })
    }

    res.status(200).json({
        message: "Movie Updated"
    })
    next()


}

export { addToWatchlist, removeFromWatchlist, updateWatchlistItem }